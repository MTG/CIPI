
def apply_filters(page, cursor, size, key, period, min_difficulty, max_difficulty):
  
    #eliminate from array the None values and the corresponding column from database
      
    query_count = "SELECT COUNT(*) FROM musicsheet WHERE"
    query_select = "SELECT * FROM musicsheet WHERE"
  
    query_filters, filtered_values= query_filters(key, period, min_difficulty, max_difficulty)

    query_count= query_count+query_filters
    cursor.execute(query_count, filtered_values)

    total_pages = cursor.fetchone()[0]
   
    # Ensure the page number is within the valid range
    if page < 1:
        page = 1
    elif page > total_pages:
        page = total_pages

    offset = (page - 1) * size

    query_select = query_select + query_filters + "  LIMIT %(limit)s OFFSET %(offset)s"
    filtered_values["limit"] = size
    filtered_values["offset"] = offset

    cursor.execute(query_select, filtered_values )
   
    return cursor, total_pages

def query_filters(key, period, min_difficulty, max_difficulty):
    query=""
    filtered_values={}

    if key is not None:
        query= query + " _key= %(key)s AND"
        filtered_values["key"] = key
    if period is not None:
        query= query + " composer_period= %(period)s AND"
        filtered_values["period"] = period
    if min_difficulty is not None and max_difficulty is not None:
        query= query + " normalized_difficulty BETWEEN %(min_difficulty)s AND %(max_difficulty)s AND"
        filtered_values["min_difficulty"] = min_difficulty
        filtered_values["max_difficulty"] = max_difficulty
    words = query.split()
    words_without_last = words[:-1]  # Exclude the last and
    query = ' '.join(words_without_last)
    return query, filtered_values
