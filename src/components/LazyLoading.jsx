import { ProductList } from "./ProductList";

export function LazyLoading(){
    return(
        <div className="container-fluid">
            <h1 className="d-flex justify-content-center">Shopper</h1>
            <ProductList />
        </div>
    )
}