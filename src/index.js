console.log('Hello, World!');

const btnEl = document.getElementById('btn-dir-picker');

async function* getFilesRecursively(entry) {
  if (entry.kind === "file") {
    const file = await entry.getFile();
    if (file !== null) {
      // create this
      file.relativePath = getRelativePath(entry);
      yield file;
    }
  } else if (entry.kind === "directory") {
    for await (const handle of entry.values()) {
      yield* getFilesRecursively(handle);
    }
  }
}

const handleClick = async (ev) => {
  console.log({
    caption: 'clicked!',
    btnEl,
    getFilesRecursively
  })
  const directoryHandle = await window.showDirectoryPicker();
  for await (const fileHandle of getFilesRecursively(directoryHandle)) {
    console.log(fileHandle);
  }
}

btnEl.onclick = handleClick;
