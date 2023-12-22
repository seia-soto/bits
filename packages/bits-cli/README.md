# bits/bits-cli

`bits-cli` helps you to store data on number from command line.

- Minimal Node.JS version: `v18.3`

## Usage

```sh
pnpm start -c <mapping> -b <data> [-i, --inflate] [-d, --deflate]

# Deflate seq of numbers
pnpm start -c <mapping> -b 1,2,3,4 -d

# Inflate number
pnpm start -c <mapping> -b 0 -i
```

Example config file:

```
field: size
```

- field: any string
- size: numeric integer
