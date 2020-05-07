const fsp = require('fs/promises');
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

// User interface prompts
const questions = [
  {
    confirm: null,
    initial: false,
    message: 'Would you like to customise this?',
    name: 'env',
    type: 'confirm',
  },
  {
    confirm: `\n  Your site's URL will be`,
    initial: 'go-wordpress',
    message: '',
    name: 'name',
    type: prev => prev == true ? 'text' : null,
    validate: value => value.match('^[A-Za-z0-9\-]*$') === null ? `You can only use alphanumerical characters and dashes, the 'http://' and'.lando.site' will be added to your choice.` : true,
  },
  {
    confirm: `\n  PHP version set to`,
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
    confirm: `\n  Webserver will be`,
    type: 'select',
    name: 'via',
    message: 'Choose a webserver',
    choices: [
      { title: 'Apache', value: 'apache' },
      { title: 'NGINX', value: 'nginx' }
    ],
    initial: 0
  },
  {
    confirm: `\n  Database set to`,
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
    confirm: `\n  Debug set to`,
    type: 'confirm',
    name: 'xdebug',
    message: 'Do you want to enable xdebug?',
    initial: true
  }
];

// Helper function: Set Lando and Bedrock configuration objects
const setConfig = (option, answer) => {
  if (option === 'name') {
    config.lando.name = answer;
    config.bedrock.WP_HOME = `http://${answer}.lndo.site`;
  } else {
    config.lando.config[option] = answer;
  }
}

// Helper function: Write Lando YML file
const writeLandoConfig = (config) => {
  
}

// Helper function: Write Bedrock ENV file
const writeBedrockConfig = (config) => {
  
}

// Show welcome message
console.log(feedback.welcome);

// Prompt for user choices and update env file
(async () => {
  const onSubmit = (prompt, answer) => {
    if (prompt.confirm !== null) {

      // Customise confirmation messages depending on prompt
      switch (prompt.name) {
        case 'name':
          console.log(`${prompt.confirm} http://${answer}.lndo.site\n`);
          break;
        case 'xdebug':
          console.log(`${prompt.confirm} ${answer ? 'enabled' : 'disabled'}\n`);
          break;
        default:
          console.log(`${prompt.confirm} ${answer}\n`);
      }

      // Call function to set Lando configuration
      setConfig(prompt.name, answer);
    }
  };

  const answers = await prompts(questions, { onSubmit });

  // Write Lando .yml file
  let yml = yaml.stringify(config.lando);
  let path = './.lando.yml';
  fsp.writeFile(path, yml , 'utf-8').then(() => {
    
    // Start throbber
    const throbber = ora(feedback.installing).start();

    // Lando command to install Bedrock
    const bedrock = spawn('lando', ['composer', 'create-project', 'roots/bedrock', 'app']);
    
    // Handle error in Bedrock installation
    bedrock.on('error', (error) => {
      throbber.stop();
      console.log(`Error: ${error.message}`);
    });

    // Once Bedrock has successfully installed
    bedrock.on('close', code => {
      throbber.stop();
      let env = '';
      let path = './app/.env';
      for (let [key, value] of Object.entries(config.bedrock)) {
        env += (`${key}=${value}\n`);
      }
      fsp.writeFile(path, env , 'utf-8');
    });
  });
})();

  
// Debug
// bedrock.on('data', (data)=> {
//   console.log(`${data}`);
// })
