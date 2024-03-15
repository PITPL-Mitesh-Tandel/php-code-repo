<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Form Builder</title>
  </head>
  <body>
    <div id="bookingWidget"></div>
    <script type="text/javascript" src="./dinetime-booking.min.js"></script>
    <script type="text/javascript">
      const config = {
        key: 'proof-pizzeria'
      };
      DineTimeBooking.init('#bookingWidget', config);
    </script>
  </body>
</html>
