<template>
  <div>
    <h1>Here is the interview page.</h1>
    <p>Valid URL example: /interview/125?token=foobar</p>
    <p>Current interview id: {{ $route.params.id }}</p>
    <p>Current token: {{ $route.query.token }}</p>
  </div>
</template>
