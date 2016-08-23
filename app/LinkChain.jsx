import "babel-polyfill";

export default class LinkChain {

  constructor(props) {
    props = props || {};
    this.data = props.data || 'source';
  }

  get length() {
    let length = 1;
    let getNext = this.next;
    while (getNext) {
      length += 1;
      getNext = getNext.next;
    }
    return length;
  }

  get next() {
    return this._next || false;
  }

  set next(val) {
    this._next = val;
  }

  get previous() {
    return this._previous || false;
  }

  set previous(val) {
    this._previous = val;
  }

  get last() {
    if (!this.next) {
      return this;
    } else {
      return this.next.last;
    }
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

}
