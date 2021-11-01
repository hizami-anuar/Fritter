<template>
    <div>
      Resource cannot be found.
      <br>
      Please use only supported routes below
      <br><br>
      <b>Home Page</b>
      <br>
      GET / -- Go to home page
      <br><br>
      <b>Authentication</b>
      <br>
      POST /api/session -- Login to a user account
      <br>
      DELETE /api/session -- Logout of a user account
      <br><br>
      <b>Users</b>
      <br>
      POST /api/users -- Create and store a new user on the server
      <br>
      PUT /api/users/:username/edit -- Update the user's username to :username on the server
      <br>
      PUT /api/users/ -- Update the user's password on the server
      <br>
      DELETE /api/users -- Delete the logged in user on the server
      <br><br>
      <b>Freets</b>
      <br>
      GET /api/freets -- Display all freets stored on the server
      <br>
      POST /api/freets -- Create and store a new freet on the server
      <br>
      PUT /api/freets/:id -- Update a freet on the server
      <br>
      DELETE /api/freets/:id? -- Delete the freet on the server with ID :id
      <br>
      GET /api/freets/:author? -- Display all freets by the author with username :author
    </div>
</template>