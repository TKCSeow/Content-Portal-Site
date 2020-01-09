export class MainController {
    constructor(){
        'ngInject';

        this.$http = $http;
    }

    postMessage() {
        this.$http.post('http://localhost:3000', {meg: 'hello'});
    }

}