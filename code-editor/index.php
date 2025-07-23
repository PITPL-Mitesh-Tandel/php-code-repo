<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Try It Yourself - Code Editor</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/codemirror.min.css">
  <style>
    body { display: flex; height: 100vh; margin: 0; font-family: sans-serif; }
    #editor-pane { width: 50%; padding: 10px; box-sizing: border-box; }
    #output-pane { width: 50%; border-left: 2px solid #ccc; }
    #controls { margin-bottom: 10px; }
    iframe { width: 100%; height: 100%; border: none; }
    .CodeMirror { height: 80vh; border: 1px solid #ccc; }
  </style>
</head>
<body>

  <div id="editor-pane">
    <div id="controls">
      <button onclick="runCode()">Run</button>
      <button onclick="resetCode()">Reset</button>
    </div>

    <textarea id="code">// Write your HTML, CSS, JS here
<!DOCTYPE html>
<html>
<head>
  <style>
    h1 { color: green; }
  </style>
</head>
<body>
  <h1>Hello World</h1>
  <script>
    console.log("Hello from JS!");
  </script>
</body>
</html></textarea>
  </div>

  <div id="output-pane">
    <iframe id="output"></iframe>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/codemirror.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/mode/htmlmixed/htmlmixed.min.js"></script>
  <script>
    const editor = CodeMirror.fromTextArea(document.getElementById("code"), {
      mode: "htmlmixed",
      lineNumbers: true,
      theme: "default"
    });

    function runCode() {
      const code = editor.getValue();
      const outputFrame = document.getElementById('output');
      outputFrame.srcdoc = code;
    }

    function resetCode() {
      editor.setValue(`<!DOCTYPE html>
<html>
<head>
  <style>
    h1 { color: green; }
  </style>
</head>
<body>
  <h1>Hello World</h1>
  <script>
    console.log("Hello from JS!");
  </script>
</body>
</html>`);
    }

    // Run once on page load
    runCode();
  </script>

</body>
</html>
