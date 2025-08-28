// ecosystem.config.js
module.exports = {
    apps: [
        {
            name: "aum-ai",                         // app name
            script: "node_modules/next/dist/bin/next",
            args: "start",
            exec_mode: "cluster",
            instances: "max",                       // or a number (e.g. 2)
            env: {
                NODE_ENV: "production",
                PORT: 3000
            },
            autorestart: true,
            max_memory_restart: "512M",
            out_file: "/var/log/pm2/aum-ai.out.log",
            error_file: "/var/log/pm2/aum-ai.err.log"
        }
    ]
};
