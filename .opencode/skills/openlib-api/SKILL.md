BASE_URL: https://openlibrary.org

# Buscar libro por título
/search.json?q=Harry+Potter&fields=key,title,author_name,cover_i

# Buscar por autor
/search.json?author=Tolkien&fields=key,title,author_name,cover_i

# Detalle de una obra
/works/OL45883W.json

# Info de un autor
/authors/OL23919A.json

# Portada del libro (con el cover_i que devuelve la búsqueda)
https://covers.openlibrary.org/b/id/{cover_i}-M.jpg