<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>

  <canvas id="doodleCanvas" width="1024" height="1024"></canvas>
  <script>
    const canvas = document.getElementById('doodleCanvas');
    const ctx = canvas.getContext('2d');
    const images = [
      'images/3_PAU124_Nov2016_AM_IllegalTradersIndianRailways.png',
      'images/8_PAU134_July2018_AM_TiimberSmuggling.png',
      'images/9_PAU135_Oct2018_AM_Uttarakhand_SpeedLimitAccidentalDeaths.png',
      'images/12_PAU138_March2019_AM_Nepal_TigerPopulation.png',
      'images/butterfly garden gray scale.png',
      'images/kolamarka 01 PAU_MH_7_wildwaterbuffaloPage11.png',
      'images/Melghat 01 40_page64.png',
      'images/Melghat 07 46_page72.png',
      'images/Pg110.png',
      'images/sewri 01 35_page49.pn'
    ]; // your doodle image paths

    function drawDoodles() {
      images.forEach(src => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          for (let i = 0; i < 20; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            ctx.drawImage(img, x, y, img.width/10, img.height/10);
          }
        };
      });
    }

    drawDoodles();
  </script>
</body>

</html>