

def filtering_period(page, cursor, size, filter_value):
    cursor.execute('SELECT COUNT(*) FROM musicsheet WHERE composer_period = %(filter)s', { 'filter': filter_value})
    
    total_pages = cursor.fetchone()[0]
   
    # Ensure the page number is within the valid range
    if page < 1:
        page = 1
    elif page > total_pages:
        page = total_pages

    offset = (page - 1) * size
   
    # Select from the database with the filter and pagination
    cursor.execute('SELECT * FROM musicsheet WHERE composer_period = %(filter)s LIMIT %(limit)s OFFSET %(offset)s', {'filter': filter_value, 'limit':size, 'offset': offset})
   
    
    return cursor, total_pages

