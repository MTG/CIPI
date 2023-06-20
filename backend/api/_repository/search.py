'''
def search_db(page, cursor, size,input_string):
    input_string='%' + input_string + '%'
    
    search_variables={'title':input_string, 'alternative_title': input_string, 'composer': input_string}
    
    query_count='SELECT COUNT(musicsheetid) FROM musicsheet WHERE work_title ILIKE %(title)s OR alternative_title ILIKE %(alternative_title)s OR composer ILIKE %(composer)s'
    cursor.execute(query_count, search_variables)
    total_pages = cursor.fetchone()[0]
    
    # Ensure the page number is within the valid range
    if page < 1:
        page = 1
    elif page > total_pages:
        page = total_pages

    offset = (page - 1) * size

    # Execute the query
    query = 'SELECT * FROM musicsheet WHERE work_title ILIKE %(title)s OR alternative_title ILIKE %(alternative_title)s OR composer ILIKE %(composer)s LIMIT %(limit)s OFFSET %(offset)s'
    search_variables["limit"] = size
    search_variables["offset"] = offset

    cursor.execute(query, search_variables)
    return cursor, total_pages
    '''
def search_db(page, cursor, size, input_string):
    
    search_variables = {'input_string': input_string}

    query_count = '''SELECT COUNT(musicsheetid) FROM musicsheet WHERE ts @@ websearch_to_tsquery('english', %(input_string)s)'''
    
    cursor.execute(query_count, search_variables)
    total_pages = cursor.fetchone()[0]

    # Ensure the page number is within the valid range
    if page < 1:
        page = 1
    elif page > total_pages:
        page = total_pages

    offset = (page - 1) * size

    # Execute the query
    query = '''SELECT * FROM musicsheet WHERE ts @@ websearch_to_tsquery('english', %(input_string)s) LIMIT %(limit)s OFFSET %(offset)s'''
    search_variables["limit"] = size
    search_variables["offset"] = offset

    cursor.execute(query, search_variables)
    return cursor, total_pages
