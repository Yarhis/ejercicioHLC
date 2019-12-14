
var categorias=[
    {id:1, categoria:'Placas Base'},
    {id:2, categoria:'Procesadores'},
    {id:3, categoria:'Discos Duros'},
    {id:4, categoria:'Memoria RAM'},
    {id:5, categoria:'Monitores'}
    ];
var productos = [
    {id:1, producto:'Gigabyte B450M DS3H', idcategoria:1, descripcion:'Las placas base GIGABYTE serie 400 maximizan el potencial de su PC con la tecnología AMD StoreMI', precio_catalogo:67.99, precio_pvp:67.99, stock:20},
    {id:2, producto:'Asus PRIME B450M-A', idcategoria:1, descripcion:'Las placas base ASUS Prime B450 Series proporcionan la base sólida necesaria para su primera construcción, además de la flexibilidad para crecer con sus ambiciones', precio_catalogo:79.99, precio_pvp:79.99, stock:0},
    {id:3, producto:'MSI Z390-A PRO', idcategoria:1, descripcion:'La placa gaming MSI Z390-A PRO tiene socket Intel 1151 y soporta procesadores Intel de 8ª y 9ª generación.', precio_catalogo:119.9, precio_pvp:104.9, stock:5},
    {id:4, producto:'Procesador AMD Ryzen 5 2600 3.4 Ghz', idcategoria:2, descripcion:'Te presentamos el AMD Ryzen 5 2600, un procesador que cuenta con 6 núcleos, socket AMD AM4 y arquitectura de 64 bits.', precio_catalogo:137.9, precio_pvp:124.9, stock:30},
    {id:5, producto:'Intel Core i7-9700K 3.6Ghz', idcategoria:2, descripcion:'Sólo compatible con sus placas base basadas en chipset de la serie 300, el procesador Intel Core i7-9700K 12M cache, hasta 4.90 GHz está diseñado para juegos, creación y productividad.', precio_catalogo:369.99, precio_pvp:369.99, stock:2},
    {id:6, producto:'Intel Core i5-9600K 3.7Ghz', idcategoria:2, descripcion:'Sólo compatible con sus placas base basadas en chipset de la serie 300, el procesador Intel Core i5-9600K 3.7 GHz Six-Core LGA 1151 está diseñado para juegos, creación y productividad.', precio_catalogo:229.9, precio_pvp:229.9, stock:10},
    {id:7, producto:'Toshiba OCZ TR200 SSD 240GB SATA3', idcategoria:3, descripcion:'Actualizar desde una unidad de disco duro (HDD) debería ser fácil y asequible y es ahí donde entran las SSD OCZ TR200. ', precio_catalogo:37.99, precio_pvp:34.99, stock:100},
    {id:8, producto:'Seagate BarraCuda 3.5 1TB SATA3', idcategoria:3, descripcion:'Versátiles. Rápidos. Fiables. La unidad de disco duro más increíble que haya conocido', precio_catalogo:38.1, precio_pvp:38.1, stock:50},
    {id:9, producto:'Crucial DDR4 2400 PC4-19200 8GB CL17', idcategoria:4, descripcion:'CT8G4DFS824A  es un módulo DDR4 de rango único de 8 GB para ordenadores de sobremesa que funciona con velocidades de hasta 2400 MT/s y tiene una latencia CL17', precio_catalogo:33.95, precio_pvp:33.95, stock:40},
    {id:10, producto:'G.Skill Ripjaws V DDR4 3000 16GB 2x8GB CL16', idcategoria:4, descripcion:'La serie Ripjaws V es una memoria DDR4 de doble canal diseñada para una máxima compatibilidad y rendimiento de vanguardia con los últimos procesadores Intel Core', precio_catalogo:82.95, precio_pvp:82.95, stock:20},
    {id:11, producto:'MSI Optix G24C4 23.6 LED FullHD 144Hz Freesync Curva', idcategoria:5, descripcion:'Los monitores Optix utilizan un panel de pantalla curva que tiene una velocidad de curvatura de R1500, que es la más cómoda y adecuada para una amplia gama de aplicaciones, desde computación general hasta juegos. Los paneles curvos también ayudan con la inmersión en el juego, haciéndote sentir más conectado con toda la experiencia.', precio_catalogo:229, precio_pvp:229, stock:10},
    {id:12, producto:'BenQ GW2480E 23.8 LED IPS FullHD', idcategoria:5, descripcion:'El monitor sin marco BenQ GW2480E de 24 combina biseles ultradelgados con gestión de cables oculta.', precio_catalogo:125, precio_pvp:109, stock:60}      
    ] ;

    var viewModel = {

categorias:ko.observableArray(categorias),

catalogo:ko.observableArray([]),

catalogoCompleto: function(){
 
    this.catalogo.removeAll();
    
    productos.forEach(element => {
       element.detalleDeProducto = ko.observable(false);
       element.boton = '<button class="fas fa-shopping-cart"> </button>';
       this.catalogo.push(element);
   });  
},

 // para ocultar/mostrar con el mouseover
    mostrarDetalles : function(producto) {
        producto.detalleDeProducto(true);
      },

    ocultarDetalles: function(producto){
        producto.detalleDeProducto(false);
    },

    //filtrado por categorias
    filtroCatalogo:ko.observable(),

    filtrarPorCategoria : function(){
        var self = this;
        this.catalogoCompleto();
        
        if(self.filtroCatalogo()!=null && self.filtroCatalogo()!=''&& self.filtroCatalogo()!=undefined){
            this.catalogo.remove( 
                function(producto) {             
                return (producto.idcategoria!=self.filtroCatalogo()); 
            });

           
        }
       
    },
    //cesta
       totalCesta: ko.observable(0),

       cesta: ko.observableArray([]),

       //solución provisional para refrescar la cesta cuando se edita el array
       refresh : function(){
        var self = this;
        var data = self.cesta().slice(0);
        self.cesta([]);
        self.cesta(data);
    }
};//end of viewmodel


/*
método que primero comprueba si el producto existe, 
 -en caso de no existir lo agrega a la cesta
- a continuación, recalcula el total de la cesta
 */
function addCesta(producto){

    if(comprobarProducto(producto)){
        producto.cantidad = 1;
        producto.precioTotal = producto.cantidad*producto.precio_pvp;
        producto.botonMenos ='<button class="fas fa-minus"> </button>';
        producto.botonMas ='<button class="fas fa-plus"></button>';
        viewModel.cesta.push(producto);
    }
   

    calcularTotalCesta();

    
    
   
}
/*
metodo que comprueba si el producto cliqueado es nuevo:
-si es nuevo, retorna true y otro método manipula la cesta
- si existe un producto ya la cesta, le suma 1 más
 */
function comprobarProducto(producto){

    //comprobamos si el producto es nuevo
    var productoNuevo= true;

    viewModel.cesta().forEach(element => {
        
        if(producto.id==element.id){
            productoNuevo=false;
            //controlamos que la cesta no tenga más pedidos que stock 
            if(element.cantidad<element.stock){
                //si existe, le añadimos el producto a la cesta y modificamos su coste
                productoTemp = {};
                productoTemp = producto;
                productoTemp.cantidad =  productoTemp.cantidad+1;
                productoTemp.precioTotal = productoTemp.cantidad*productoTemp.precio_pvp;
        
                viewModel.cesta.replace (producto,productoTemp);
                viewModel.refresh();
            }else{
                alert("No se puede añadir más articulos de ese producto, no existe stock suficiente.");
            }
           
        }
        });

        return productoNuevo;
}

/*
metodo para calcular el total de la cesta. primero deja el valor a 0 
y la recorre para calcular la suma de todos los valores de la cesta
*/
function calcularTotalCesta(){

    viewModel.totalCesta(0);

    viewModel.cesta().forEach(element => {
        viewModel.totalCesta(viewModel.totalCesta()+element.precioTotal);
    });

}





/*
Método que resta elementos de la cesta. 
Si es el último elemento, quita este producto de la cesta

*/
function restaProducto(producto){

    viewModel.cesta().forEach(element => {

        if(producto.id==element.id){
            productoTemp = {};
            productoTemp = producto;
            productoTemp.cantidad =  productoTemp.cantidad-1;
            productoTemp.precioTotal = productoTemp.cantidad*productoTemp.precio_pvp;
            viewModel.cesta.replace (producto,productoTemp);  
            viewModel.refresh();          
        }
       
    });

    if(productoTemp.cantidad<=0){
        viewModel.cesta.remove(producto);
    }
    calcularTotalCesta();
}



ko.options.deferUpdates = true;

ko.applyBindings(viewModel);

//carga inicial
viewModel.catalogoCompleto();


