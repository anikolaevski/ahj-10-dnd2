/* eslint-disable no-plusplus */

function removeDelBox(el) {
  let delBox = el.querySelector('.delete-box');
  while (delBox) {
    const parent = delBox.parentElement;
    parent.removeChild(delBox);
    delBox = el.querySelector('.delete-box');
  }
}

function setState(state) {
  const enterfileState = document.querySelector('#enterfileState');
  if (!enterfileState) { return; }
  if (state) {
    enterfileState.innerHTML = '<p class="successmsg">Ссылка добавлена</p>';
  } else {
    enterfileState.innerHTML = '<p class="errormsg">Неверный URL изображения</p>';
  }
  enterfileState.classList.remove('invisible');
}

function SaveContent(name, el) {
  const el2 = el.cloneNode();
  el2.innerHTML = el.innerHTML;
  removeDelBox(el2);
  const saveArr = [];
  const arr = Array.prototype.slice.call(el2.childNodes);
  arr.forEach((o) => {
    saveArr.push(JSON.stringify({ item: o.innerHTML }));
  });
  localStorage.setItem(name, saveArr);
}

function LoadContent(name, el) {
  let child = el.lastElementChild;
  while (child) {
    el.removeChild(child);
    child = el.lastElementChild;
  }
  const app = JSON.parse(`[${localStorage.getItem(name)}]`);
  app.forEach((o) => {
    const tr = document.createElement('tr');
    if (o) {
    // console.log(o);
      tr.innerHTML = o.item;
      el.appendChild(tr);
    }
    const TabImg = tr.querySelector('.tab-img');
    if (TabImg) {
      /* eslint-disable no-use-before-define */
      prepDeleteElement(TabImg);
    }
  });
  const enterfileState = document.querySelector('#enterfileState');
  if (enterfileState) {
    enterfileState.classList.add('invisible');
  }
}

function OptDoRemove(evt) {
  // console.log(evt.target);
  const el = evt.target;
  const td = el.parentElement;
  const tr = td.parentElement;
  const ImageTbody = document.querySelector('[data-id=image_tbody]');
  if (ImageTbody && tr) {
    removeDelBox(tr);
    ImageTbody.removeChild(tr);
    SaveContent('imgManager', ImageTbody);
    LoadContent('imgManager', ImageTbody);
  }
}

function prepDeleteElement(td) {
  removeDelBox(td);
  const div = document.createElement('div');
  td.appendChild(div);
  div.classList.add('delete-box');
  div.style.top = `${-td.offsetHeight + 40}px`;
  div.style.left = `${td.offsetWidth - 50}px`;
  div.addEventListener('click', OptDoRemove);
}

document.querySelector('#enterbutton').addEventListener('click', (evt) => {
  evt.preventDefault();
  const enterfile = document.querySelector('#enterfile');
  if (!enterfile) {
    enterfile.value = '';
    return;
  }
  const TestImage = document.querySelector('[data-id=test_image]');
  let todel = TestImage.querySelector('img');
  while (todel) {
    TestImage.removeChild(todel);
    todel = TestImage.querySelector('img');
  }
  const img = document.createElement('img');
  img.src = enterfile.value;
  img.alt = 'test image';
  img.onload = () => {
    refillTable(enterfile.value);
    enterfile.value = '';
  };
  img.onerror = () => {
    setState(false);
    enterfile.value = '';
  };
  TestImage.appendChild(img);
});

function refillTable(url) {
  // console.log('success');
  const ImageTbody = document.querySelector('[data-id=image_tbody]');
  if (!ImageTbody) { return; }
  const tr = document.createElement('tr');

  const refElement = ImageTbody.firstChild;
  if (refElement) {
    ImageTbody.insertBefore(tr, refElement);
  } else {
    ImageTbody.appendChild(tr);
  }

  const td1 = document.createElement('td');
  td1.classList.add('tab-url');
  td1.innerHTML = `<a href="${url}">${url.substring(0, 20)}...</a>`;
  tr.appendChild(td1);
  const td2 = document.createElement('td');
  const img2 = document.createElement('img');
  img2.src = url;
  img2.alt = 'test image';
  img2.width = '500';
  td2.classList.add('tab-img');
  td2.appendChild(img2);
  tr.appendChild(td2);
  prepDeleteElement(td2);
  SaveContent('imgManager', ImageTbody);
  // enterfile.value = '';
  setState(true);
}

document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line no-console
  const ImageTbody = document.querySelector('[data-id=image_tbody]');
  LoadContent('imgManager', ImageTbody);
  /* eslint-disable no-console */
  console.log('Module started!');
});

const dropEl = document.querySelector('#dropzine');

dropEl.addEventListener('dragover', (evt) => {
  evt.preventDefault();
});

dropEl.addEventListener('drop', (evt) => {
  evt.preventDefault();
  const droppedHTML = evt.dataTransfer.getData('text/html');
  if (droppedHTML) {
    let prevdiv = dropEl.querySelector('div');
    while (prevdiv) {
      dropEl.removeChild(prevdiv);
      prevdiv = dropEl.querySelector('div');
    }
    const div = document.createElement('div');
    div.classList.add('invisible');
    dropEl.appendChild(div);
    div.innerHTML = droppedHTML;
    const img = div.querySelector('img');
    const bg = div.querySelector('[style*=background-image]');
    // console.log(img);
    if (img) {
      refillTable(img.src);
    } else if (bg) {
      const x = bg.style.backgroundImage.slice(4, -1).replace(/"/g, '');
      if (x) {
        refillTable(x);
      }
    } else {
      // console.log(droppedHTML);
      setState(false);
    }
  } else {
    // console.log('Пусто');
    setState(false);
  }
});
