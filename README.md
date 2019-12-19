# social-network

React-based single page application, where users can collect trip ideas, filter them by distance, travel mode and weather conditions and display the results on a map.

# Features

-   login and registration
-   add destinations
    -   users can enter address or mark destination on a map
    -   travel time from home address to location is calculated for different transport modes (Google Maps Distance Matrix API)
    -   users can set the weather conditions(??)
-   overview over results
    -   results are automatically filtered according to the weather conditions (data from weather API) - users can change the day
    -   users can additionally filter the results by maximal travel time and by mode of transportion
-   detail view of destination
    -   destination is marked on a Maps
    -   users have the opportunity to mark a destination as a favourite
    -   other destinations (that fit to the current filter) are also shown an the map: by clicking on the marker the user gets detail information on these destinations

# Technology

-   React
-   Node.js
-   Express
-   PostgresSQL
-   Javascript
-   Google Maps and Weather APIs

# Previews
