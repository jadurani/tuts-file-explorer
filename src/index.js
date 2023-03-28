console.log('Hello, World!');

const btnOpenDirEl = document.getElementById('btn-dir-picker');
const btnOpenFileEl = document.getElementById('btn-file-picker');

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

const handleOpenDirClick = async (ev) => {
  console.log({
    caption: 'clicked!',
    btnOpenDirEl,
    getFilesRecursively
  })
  const directoryHandle = await window.showDirectoryPicker();
  const fileTree = [];
  for await (const fileHandle of getFilesRecursively(directoryHandle, '')) {
    fileTree.push(fileHandle);
  }
  console.log(fileTree);
};

const handleOpenFileClick = async (ev) => {
  const [fileHandle] = await window.showOpenFilePicker({
    types: [
      {
        description: 'Text Files',
        accept: {
          'text/plain': ['.txt', '.text'],
        },
      },
      {
        description: 'All Files',
        accept: {
          '*/*': ['.'],
        },
      },
    ],
  });

  console.log({fileHandle})
}

btnOpenDirEl.onclick = handleOpenDirClick;
btnOpenFileEl.onclick = handleOpenFileClick;
