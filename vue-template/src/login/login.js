import LoadEnvironment from '../main/environment';
import main from "../main";
LoadEnvironment('login/login_applications.json').then(function (data) {
    main(data);
});