import "babel-polyfill";

export default class LinkChain {

  constructor(data = {}) {
    this.data = data;
  }

  get length() {
    let length = 0;
    let getLink = this.first;
    while (getLink) {
      length += 1;
      getLink = getLink.next;
    }
    return length;
  }

  get height() {
    let height = -1;
    let getLink = this;
    while (getLink) {
      height += 1;
      getLink = getLink.next;
    }
    return height;
  }

  get next() {
    return this._next || null;
  }

  set next(val) {
    this._next = val;
  }

  get previous() {
    return this._previous || null;
  }

  set previous(val) {
    this._previous = val;
  }

  get first() {
    if (!this.previous) {
      return this;
    } else {
      return this.previous.first;
    }
  }

  get last() {
    if (!this.next) {
      return this;
    } else {
      return this.next.last;
    }
  }

  sever() {
    if (this.next) {
      this.next.previous = null;
    }
    if (this.previous) {
      this.previous.next = null;
    }
    this.next = null;
  }

  insert(link) {
    if (this.previous) {
      let linkStore = this.previous;
      linkStore.next = link;
      link.previous = linkStore;
    }
    this.previous = link;
    link.next = this;
  }

  append(link) {
    link.previous = this.last;
    this.last.next = link;
  }

  *[Symbol.iterator]() {

    yield this;
    let nextLink = this.next;
    while (nextLink) {
      yield nextLink;
      nextLink = nextLink.next;
    }

  }

  toString() {
    let first = this.first;
    let result = [];
    for (let link of first) {
      result.push(link.data);
    }
    result.push(this.height);
    return JSON.stringify(result);
  }

  // Currently unsupported syntax
  //
  // [Symbol.toStringTag]() {
  //   return "Values...";
  // }

  static parse(data) {
    let parsedChain;
    let objData = JSON.parse(data);
    let idx = objData.pop();
    let i = 0;
    for (let datum of objData) {
      if (i == 0) {
        parsedChain = new LinkChain(datum);
      } else {
        parsedChain.append(new LinkChain(datum));
      }
      i++;
    }
    let link = parsedChain;
    for (i = 0; i < idx; i++) {
      link = link.next;
    }
    return link;
  }

}
