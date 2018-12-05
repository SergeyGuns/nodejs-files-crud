function addPreviewIfImg(file) {
  let ext;
  try { ext = file.split('.')[file.split('.').length-1]}
  catch (e) {console.log(e)}
  console.log(file,ext)
  if (['svg', 'jpg', 'png', 'SVG', 'JPG', 'PNG'].indexOf(ext)!==-1) {
    return `<img width='50' src='/static/${file}'/>`
  } 
  return '';
}

export function menu() {
  return `
  <a href='/'> home </a>
  |
  <a href='/list'> files </a>
  | 
  <a href='/create'> create </a>
  |
  <a href='/upload'> upload </a>
`}

export function header() {
  return `
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <script>
    document.addEventListener('click', function(ev){
      if(ev.target.dataset.del) {
        fetch('/'+ev.target.dataset.del,{
          method: 'DELETE'
        }).then(location.reload()).catch(err=>console.log(err))
      }
    })
  </script>
</head>
`}
export const fileList = (files) => `<html lang="en">
${header()}
<body> 
  ${menu()}
  <ul>
    ${
      files.map(file => `
        <li> 
          ${''+addPreviewIfImg(file)} 
          ${file} 
          [<b data-del="${file}">DELETE</b>]
          [<a download href='/static/${file}'>DOWNLOAD</a>]
        </li>`).join('\n')
    }   
  </ul>
</body>
</html>`

export function createFile() {
  return `
<html lang="en">
${header()}
<body>
  <form action="/create" method="post" >
    <input name="filename" type="text"/>
    <textarea name="content"></textarea>
    <button>SEND</button>
  <form>
</body>
</html>

  `
}
export function uploadFile() {
  return `
<html lang="en">
${header()}
<body>
<form action="/upload" method="post" enctype="multipart/form-data">
  <input type="file" name="filetoupload"><br>
  <input type="submit">
</form>
</body>
</html>

  `
}

