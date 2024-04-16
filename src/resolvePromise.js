export function resolvePromise(prms, promiseState){
    promiseState.promise= prms;
    promiseState.data= null;
    promiseState.error= null;
    if(prms !== null)
        prms.then(resultACB).catch(errorACB);

    function resultACB(result){
        if(promiseState.promise === prms){
            //console.log("resolvePromise result", result);
            promiseState.data = result;
        }
    }
    function errorACB(error){
        if(promiseState.promise === prms)
            promiseState.error = error;
    }

}