const { TouchBarScrubber } = require("electron");

class Paginator {
    constructor() {
        this.active_element = null;
        this.indexes = [1,2,3,4,5];
        this.max_record_on_page = 5;
        this.number_of_first_record = 0;
    }
    set index(indx) {
        this.indexes = indx.reverse();
    }
    activate(element) {
        if (this.active_element) {
            this.active_element.classList.remove("active");
        }
        this.active_element = element;
        element.classList.add("active");
    }
    next() {
        this.number_of_first_record = this.number_of_first_record + this.max_record_on_page;
        if (this.number_of_first_record >= this.indexes.length) {
            this.number_of_first_record = this.indexes.length-1;
        }
        this.redrawPaginator();
    }
    previous() {
        this.number_of_first_record = this.number_of_first_record - this.max_record_on_page;
        if (this.number_of_first_record < 0) {
            this.number_of_first_record = 0;
        }
        this.redrawPaginator();
    }
    redrawPaginator() {
        while (this.parent_element.firstChild) {
            this.parent_element.firstChild.remove();
          }
        let left = document.createElement("a");
        left.innerHTML = '&laquo;';
        this.parent_element.appendChild(left);
        
        let paginator = this;
        left.addEventListener('click', function() {
            paginator.previous();
        });

        let i = this.number_of_first_record;
        let limit = i + this.max_record_on_page;
        if (limit > this.indexes.length) {
            limit = this.indexes.length;
        }
        let fn = this.fn;
        for (let x=i; x < limit; x++) {
            let key = this.indexes[x];
            console.log('key: ', key);
            let element = document.createElement("a");
            element.innerHTML = x;
            this.parent_element.appendChild(element);
            element.addEventListener('click', function() {
                paginator.activate(this);
                console.log('x: ', x);
                fn(key);
            });
        
        }
        let right = document.createElement("a");
        right.innerHTML = '&raquo;';
        this.parent_element.appendChild(right);
        right.addEventListener('click', function() {
            paginator.next();
        });
    }
    drawPaginator(parent_element, fn) {
        this.parent_element = parent_element;
        this.fn = fn;
        this.redrawPaginator(); 
    }
}

exports.paginator = new Paginator();