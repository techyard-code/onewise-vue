<template>
    <v-container fluid fill-height>
      <v-row align="center" justify="center">
        <v-col cols="12">
          <v-card>
            <v-toolbar dark color="primary">
              <v-toolbar-title>404 Not Found</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <h1 class="text-h1">Page Not Found</h1>
              <p>The page you are looking for does not exist.</p>
              <p>Try checking the URL or going back to the previous page.</p>
            </v-card-text>
            <v-card-actions>
              <v-btn to="/login" color="primary">Go Back Home</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    name: "404",
  }
  </script>