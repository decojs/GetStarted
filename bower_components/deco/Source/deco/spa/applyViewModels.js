define([
  "deco/utils",
  "deco/errorHandler",
  "deco/spa/viewModelFactory",
  "knockout",
  "deco/spa/extendKnockout"
], function (
  utils, 
  errorHandler,
  viewModelFactory,
  ko
) {

  function applyViewModel(data) {
    data.target['@SymbolDecoViewModel'] = data.viewModelName;
    ko.applyBindings(data.viewModel, data.target);
  }

  function viewModelLoadedSuccessfully(data){
    return data != null && data.ViewModel != null;
  }

  return function (domElement, subscribe) {
    domElement = domElement || document.body;

    var viewModelsLoaded = utils.toArray(domElement.querySelectorAll("[data-viewmodel]"))
      .filter(function(element){
        while(element = element.parentNode){
          if(element === domElement) return true;
          if(element.hasAttribute("data-viewmodel")) return false;
        }
        return true;
      })
      .map(viewModelFactory.getViewModelFromAttributes)
      .map(viewModelFactory.loadViewModel);

    return Promise.all(viewModelsLoaded).then(function(list){
      list
        .filter(viewModelLoadedSuccessfully)
        .map(function(data){
          return viewModelFactory.createViewModel(data, subscribe);
        })
        .forEach(applyViewModel);
    }).catch(function(error){
      errorHandler.onError(error);
    });
  };
});