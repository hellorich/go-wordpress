const fs = require('fs');
const ora = require('ora');
const yaml = require('yaml');
const prompts = require('prompts');
const spawn = require('child_process').spawn;

// Settings object
const config = {
  'bedrock': {
    'DB_NAME': 'wordpress',
    'DB_USER': 'wordpress',
    'DB_PASSWORD': 'wordpress',
    'DB_HOST': 'database',
    'WP_ENV': 'development',
    'WP_HOME': 'http://go-wordpress.lndo.site',
    'WP_SITEURL': '${WP_HOME}/wp',
  },
  'lando': {
    'name': 'go-wordpress',
    'recipe': 'wordpress',
    'config': {
      'php': 7.2,
      'via': 'nginx',
      'webroot': 'app/web',
      'database': 'mariadb',
      'xdebug': true
    }
  }
}

// Feedback messages
const feedback = {
  'welcome': `\n  🤖\n\n  Your development site will run on:\n\n  ${config.bedrock.WP_HOME}\n`,
  'installing': 'Installing development environment...',
}

// Lando command to install Bedrock
const bedrock = spawn('lando', ['composer', 'create-project', 'roots/bedrock', 'app']);

// User interface prompts
const questions = [
  {
    confirm: ``,
    initial: false,
    message: 'Would you like to customise this?',
    name: 'env',
    type: 'confirm',
  },
  {
    confirm: `\n  Dev server set\n`,
    initial: 'go-wordpress',
    message: '',
    name: 'domain',
    type: prev => prev == true ? 'text' : null,
    validate: value => value.match('^[A-Za-z0-9\-]*$') === null ? `You can only use alphanumerical characters and dashes, the 'http://' and'.lando.site' will be added to your choice.` : true,
  },
  {
    confirm: `\n  PHP version set\n`,
    type: 'select',
    name: 'php',
    message: 'Choose a PHP version',
    choices: [
      { title: '7.3', value: 7.3 },
      { title: '7.4', value: 7.4 }
    ],
    initial: 0
  },
  {
    confirm: `\n  Webserver set\n`,
    type: 'select',
    name: 'webserver',
    message: 'Choose a webserver',
    choices: [
      { title: 'Apache', value: 'apache' },
      { title: 'NGINX', value: 'nginx' }
    ],
    initial: 0
  },
  {
    confirm: `\n  Database set\n`,
    type: 'select',
    name: 'database',
    message: 'Choose a database',
    choices: [
      { title: 'MySQL', value: 'mysql' },
      { title: 'MariaDB', value: 'mariadb' },
      { title: 'Postgres', value: 'postgres' }
    ],
    initial: 0
  },
  {
    confirm: `\n  Debug set\n`,
    type: 'confirm',
    name: 'xdebug',
    message: 'Do you want to enable xdebug?',
    initial: true
  }
];

// Show welcome message
console.log(feedback.welcome);

// Prompt for user choices and update env file
(async () => {
  const onSubmit = (prompt, answer) => {
    if (prompt.confirm !== null) {
      console.log(prompt.confirm);
    }
  };
  const answers = await prompts(questions, { onSubmit });

  // Assign answers
  config.bedrock.WP_HOME = `http://${answers.domain}.lndo.site`;
  config.lando.name = answers.domain;
  config.lando.config.php = answers.php;
  config.lando.config.via = answers.webserver;
  config.lando.config.database = answers.database;
  config.lando.config.xdebug = answers.xdebug;

  // Start throbber
  const throbber = ora(feedback.installing).start();
  
  // Debug
  // bedrock.on('data', (data)=> {
  //   console.log(`${data}`);
  // })

  // Error message handling 
  bedrock.on('error', (error) => {
    throbber.stop();
    console.log(`Error: ${error.message}`);
  });

  // On Bedrock installation
  bedrock.on('close', code => {
    throbber.stop();
    
    // Configure Bedrock
    // Write the ./app/.env file with our configuration
    // Improve this with destructuring / JSON.stringify?
    let env = '';
    for (let [key, value] of Object.entries(config.bedrock)) {
      env += (`${key}=${value}\n`);
    }
    fs.writeFileSync('./app/.env', env , 'utf-8');

    // Configure Lando
    // Amend ./.lando.yml with our configuration
    let yml = yaml.stringify(config.lando);
    fs.writeFileSync('./.lando.yml', yml , 'utf-8');
  });
})();
