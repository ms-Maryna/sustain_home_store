// This file holds global constants that are visible on the Client-side

// Access level
export const ACCESS_LEVEL_GUEST = 0
export const ACCESS_LEVEL_NORMAL_USER = 1
export const ACCESS_LEVEL_ADMIN = 2


// Server
// Online (demo): set REACT_APP_SERVER_HOST on the hosting website to the address of the server.
// On your computer: http://localhost:4000 is used.
export const SERVER_HOST = process.env.REACT_APP_SERVER_HOST || `http://localhost:4000`


// Returns are possible for this many days after payment (the same number is used on the server)
export const RETURN_DAYS = 30
