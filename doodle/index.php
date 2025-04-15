<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8" />
  <title>Doodle Background</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.6.0/p5.min.js"></script>
</head>

<body>
  <script>
    let images = [];
    let placed = [];

    function preload() {
      const list = [
        'images/3_PAU124_Nov2016_AM_IllegalTradersIndianRailways.png',
        'images/8_PAU134_July2018_AM_TiimberSmuggling.png',
        'images/9_PAU135_Oct2018_AM_Uttarakhand_SpeedLimitAccidentalDeaths.png',
        'images/12_PAU138_March2019_AM_Nepal_TigerPopulation.png',
        'images/butterfly_garden_gray_scale.png',
        'images/kolamarka_01_PAU_MH_7_wildwaterbuffaloPage11.png',
        'images/Melghat_01_40_page64.png',
        'images/Melghat_07_46_page72.png',
        'images/Pg110.png',
        'images/sewri_01_35_page49.png'
      ];

      list.forEach(img => {
        images.push(loadImage(`http://localhost/temp/doodle/${img}`));
      });
    }

    function setup() {
      createCanvas(500, 500);
      background(255);

      let cols = 8;
      let rows = 8;
      let padding = 20;
      let cellSize = 60; // Each cell will be 60x60 px

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let cx = x * cellSize + padding;
          let cy = y * cellSize + padding;

          push();
          translate(cx + cellSize / 2, cy + cellSize / 2);
          rotate(random(TWO_PI)); // optional rotation
          imageMode(CENTER);
          let img = random(images);
          image(img, 0, 0, 40, 40); // draw image
          pop();
        }
      }
    }

    function placeImageWithoutOverlap(img, w, h, maxTries = 200) {
      let x, y;
      for (let i = 0; i < maxTries; i++) {
        x = random(width - w);
        y = random(height - h);

        if (!isOverlapping(x, y, w, h)) {
          let angle = random(TWO_PI); // Random rotation angle in radians

          push(); // Save the current transformation state
          translate(x + w / 2, y + h / 2); // Move to the center of where image will be drawn
          rotate(angle); // Rotate around the center
          imageMode(CENTER); // Set drawing mode so image draws from center
          image(img, 0, 0, w, h);
          pop(); // Restore original state

          placed.push({
            x,
            y,
            w,
            h
          });
          break;
        }
      }
    }

    function isOverlapping(x, y, w, h) {
      return placed.some(p => {
        return !(
          x + w < p.x ||
          x > p.x + p.w ||
          y + h < p.y ||
          y > p.y + p.h
        );
      });
    }
  </script>
</body>

</html>