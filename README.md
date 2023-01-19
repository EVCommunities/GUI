# GUI for EV Communities Simulations

## Installation instruction

 - First run the GUI backend
	`cd Node-backend && npm install`
    `npm start`
 -  Next run the React application
 	`cd React-frontend && npm install`
    `npm run dev`
	 For some scenarios, due to a nextJS limitation, ChartJs timeline was getting errors with default npm package of chartjs-adapter-date-fns.  For fix that please change the following in React-frontend/node_modules/chartjs-adapter-date-fns/dist/chartjs-adapter-date-fns.esm.js  file
	 Comment out :
	 `import { _adapters } from 'chart.js';`
	 Add :
	 `import  pkg  from  'chart.js';`
    `const { _adapters } = pkg;`

## Docker installation instructions

1. Setup environmental variables by setting up `.env` file:

    ```bash
    cp .env.template .env
   # edit the values in .env
    ```

2. Start the GUI backend and frontend with Docker Compose:

    ```bash
    docker-compose up --build --detach
    ```

- To stop the and remove the created containers: `docker-compose down --remove-orphans`
