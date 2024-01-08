# Deel's Take Home Assessment

This project contains a React functional component implementing an autocomplete feature using TypeScript. The component fetches data asynchronously, supports keyboard navigation, and handles various edge cases for robust functionality. It's Production-ready and can be used as a drop-in component in any React application. The code is covered by automated tests splitted into unit, componet and integration contexts.

## Features

- Asynchronous data fetching
- Debounced input for optimized performance
- Keyboard navigation (arrow keys for navigation, enter key for selection)
- Highlighting matching text in suggestions
- Basic styling for the autocomplete dropdown

## Running the Project

There are some possibilities to run the project. First of all, you need to clone choose either running for production or development. Bellow you can find the instructions for each case.

### Running for Production

The production build is optimized and served by two instances of SPA splitting the traffic between them and a Ngix load balancer handling the requests.

#### (Docker) with Makefile

```bash
make up
```

#### (Docker) with Docker Compose

```bash
docker-compose up
```

#### Locally

```bash
  npm run build && npm run start
```

### Running for Development

The development build is served by a single instance of SPA. It's focused on development and is instrumentated with a hot-reloading server.

#### (Docker) with Makefile

```bash
  make dev
  # OR
  make
```

#### (Docker) with Docker Compose

```bash
  docker-compose -f docker-compose.local.yml up
```

#### Locally

```bash
  npm i && npm run dev
```

## Testing

The project is covered by automated tests splitted into unit, component and integration contexts. The tests are run by Vitest and React Testing Library.
The UI dashboard will open automatically after running the tests.

### Running Tests

```bash
  npm run test
```

#### Running Tests by Context

```bash
  npm run test -t=unit
  # OR
  npm run test -t=component
  # OR
  npm run test -t=integration
```

## Environment

The project is configured to allow commits with certain patterns only. Not able to commit with failing tests, linting errors or commit messages not following the Conventional Commits specification.

Those rules are enforced by Husky and Lint Staged, that interact with Git Hooks, Commitlint, EsLint, Prettier and Vitest.
