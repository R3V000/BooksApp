{
  'use strict';

  const select = {
    template:{
      bookTemplate: '#template-book',
    },

    booksPanel:{
      booksList: '.books-list',
      allBooks: '.book',
    },

    filters:{
      filtersForm: '.filters',
    },

  };

  const templates = {
    bookTemplate: Handlebars.compile(document.querySelector(select.template.bookTemplate).innerHTML),
  };


  class BookList{
    constructor(){

      this.initData();
      this.getElements();
      this.render();
      this.initActions();
    }

    getElements(){
      this.booksList = document.querySelector(select.booksPanel.booksList);
      this.filtersForm = document.querySelector(select.filters.filtersForm);
    }

    initData(){
      this.data = dataSource.books;
    }

    render(){
      for(let book of this.data){
        const ratingBgc = this.determineRatingBgc(book.rating);
        const ratingWidth = (book.rating/10)*100;
        book.ratingWidth = ratingWidth;
        book.ratingBgc = ratingBgc;
        const generatedHTML = templates.bookTemplate(book);
        this.element = utils.createDOMFromHTML(generatedHTML);
        const containerOfList = this.booksList;
        containerOfList.appendChild(this.element);
        
      }
    }

    initActions(){
      this.favoriteBooks = [];
      this.filters = [];
      
      this.booksList.addEventListener('dblclick', (event) => {
        event.preventDefault();

        const clickedImage = event.target.offsetParent;
        const idBook = clickedImage.getAttribute('data-id');

        if(clickedImage.classList.contains('favorite')){
          clickedImage.classList.remove('favorite');
          this.favoriteBooks.pop(idBook);
        }else{
          clickedImage.classList.add('favorite');
          if(idBook!==null) this.favoriteBooks.push(idBook);

        }
        console.log('favoriteBooks', this.favoriteBooks);
      });

      this.filtersForm.addEventListener('click', (event) => {
        const clickedElem = event.target;
        if(clickedElem.tagName=='INPUT' && clickedElem.type=='checkbox' && clickedElem.name=='filter'){
          if(clickedElem.checked){
            this.filters.push(clickedElem.value);
          }else{
            const elemIndex = this.filters.indexOf(clickedElem.value);
            this.filters.splice(elemIndex, 1);
          }
        }
        this.filter();
      });


    }

    filter(){
      for(let book of this.data){
        const filterBook = document.querySelector('.book__image[data-id="'+book.id+'"]');
        let shouldBeHidden = false;
        for(const filter of this.filters){
          if(!book.details[filter]){
            filterBook.classList.add('hidden');
            shouldBeHidden = true;
            break;
          }
        }
        if(shouldBeHidden == false){
          filterBook.classList.remove('hidden');
        }
      }
    }

    determineRatingBgc(rating){
      let background = '';

      if(rating<6){
        background = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%);';
      } else if(rating > 6 && rating <= 8){
        background = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%);';
      } else if(rating > 8 && rating <= 9){
        background = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%);';
      } else if(rating > 9){
        background = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%);';
      }

      return background;
    }
  }

  new BookList();
}