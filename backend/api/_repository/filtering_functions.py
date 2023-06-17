
def apply_filters(page, cursor, size, key, period, min_difficulty, max_difficulty):
  
    #eliminate from array the None values and the corresponding column from database
      
    query = "SELECT COUNT(*) FROM musicsheet WHERE"
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
    #difficulty amb una mitja dels 3 valors--> normalitzar i afegir a una columna
    words = query.split()
    words_without_last = words[:-1]  # Exclude the last and

    query = ' '.join(words_without_last)

    cursor.execute(query, filtered_values)

    total_pages = cursor.fetchone()[0]
   
    # Ensure the page number is within the valid range
    if page < 1:
        page = 1
    elif page > total_pages:
        page = total_pages

    offset = (page - 1) * size

    words = query.split()
    for i in range(len(words)):
        if words[i] == "COUNT(*)":
            words[i] = "*"
            break

    query = ' '.join(words)

    query = query + "  LIMIT %(limit)s OFFSET %(offset)s"
    filtered_values["limit"] = size
    filtered_values["offset"] = offset

    cursor.execute(query, filtered_values )
   
    
    return cursor, total_pages

