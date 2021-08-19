# url-shortner-microservice

FCC project from the APIs and Microservices module.

# Requirements

1. You can POST a URL to /api/shorturl and get a JSON response with original_url and short_url properties. Here's an example: { original_url : 'https://freeCodeCamp.org', short_url : 1}
2. When you visit /api/shorturl/<short_url>, you will be redirected to the original URL.
3. If you pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain { error: 'invalid url' }

# Challenges

- The dns.lookup() was pretty tricky to work with. You cannot use protocols or have trailing slashes on the url. Discovered through a stack oveflow post rather than documention. Solution was to trim urls with some regex and replace().

# Improvements

- Adding more CRUD functionlity and persisting data in a database.
