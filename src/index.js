console.log('Hello, World!');

const btnEl = document.getElementById('btn-dir-picker');

async function* getFilesRecursively(entry, currentPath) {
  if (entry.kind === "file") {
    const file = await entry.getFile();
    if (file !== null) {
      file.relativePath = `${currentPath}/${entry.name}`;
      yield file;
    }
  } else if (entry.kind === "directory") {
    for await (const handle of entry.values()) {
      yield* getFilesRecursively(handle, `${currentPath}/${entry.name}`);
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
  const fileTree = [];
  for await (const fileHandle of getFilesRecursively(directoryHandle, '')) {
    fileTree.push(fileHandle);
  }
  console.log(fileTree);
}

btnEl.onclick = handleClick;
