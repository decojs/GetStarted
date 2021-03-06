define([
  "deco/errorHandler"
], function(
  errorHandler
) {
  return {
    getViewModelFromAttributes: function(target){
      var viewModelName = target.getAttribute("data-viewmodel");
      var model = target.getAttribute("data-model");

      return {
        target: target,
        viewModelName: viewModelName,
        model: model
      };
    },
    
    loadViewModel: function(data){
      return new Promise(function(resolve, reject){
        require([data.viewModelName], resolve, reject);
      }).then(function(ViewModel){
        return {
          viewModelName: data.viewModelName,
          ViewModel: ViewModel,
          model: data.model,
          target: data.target
        }
      }, function(error){
        errorHandler.onError(new Error("Could not load the following modules:\n"+error.requireModules.join("\n")));
        return null;
      });
    },

    createViewModel: function(data, subscribe, parentViewModel) {
      var model = (data.model && (data.model.charAt(0) == '{' || data.model.charAt(0) == '['))
        ? JSON.parse(data.model)
        : {};
      var whenContext = subscribe();
      var viewModel = new data.ViewModel(model, whenContext, parentViewModel);
      viewModel['@SymbolDecoWhenContext'] = whenContext;
      return {
        viewModelName: data.viewModelName,
        viewModel: viewModel,
        target: data.target
      }
    }
  }
});