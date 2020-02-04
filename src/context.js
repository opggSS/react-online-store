import React, { Component } from 'react'
import {storeProducts, detailProduct} from './data'
const ProductContext = React.createContext()
//provider 
//consumer

class ProductProvider extends Component {
    state={
        products: [], 
        detailProduct: detailProduct,
        cart: [],
        modalOpen : false,
        modalProduct: detailProduct,
        cartSubTotal: 0,
        cartTax: 0,
        cartTotal: 0 ,

    }
    componentDidMount() {
        this.setProducts()
    }
    getItem = (id) =>{
        const product  = this.state.products.find(item => item.id === id)
        return product
    }
    
    setProducts = () =>{
        let tempProducts = []
        storeProducts.forEach ( item => {
            const singleItem = {...item}
            tempProducts = [...tempProducts , singleItem] 
        })
        this.setState ({
            products: tempProducts
        })
    }

    handleDetail = (id) =>{
        const product = this.getItem(id)
        this.setState(() => {
            return {detailProduct:product}
        })
    }
    addToCart = (id) => {
        const tempProducts = [...this.state.products] 
        const index = tempProducts.indexOf(this.getItem(id))
        const product  = tempProducts[index]
        product.inCart = true
        product.count = 1 
        const price  = product.price
        product.total = price
        this.setState({
            products : tempProducts ,
            cart : [...this.state.cart , product]
        }, () =>{
            this.addTotals();
        })
        

        
    }
    openModal = id =>{
        const product = this.getItem(id)
        this.setState({
            modalProduct : product,
            modalOpen: true
        })
    }
    closeModal = () =>{
        this.setState({
            modalOpen: false
        })
    }
    increment = (id) =>{
        let tempCart = [...this.state.cart]
        const selectedProduct = tempCart.find((item) => item.id === id)
        selectedProduct.count +=1 
        selectedProduct.total = selectedProduct.count * selectedProduct.price
        this.setState({
            cart : [...tempCart]
        } , () =>{
            this.addTotals()
        }) 
    }

    decrement = (id) =>{
        let tempCart = [...this.state.cart]
        const selectedProduct = tempCart.find((item) => item.id === id)
        selectedProduct.count -=1 
        
        if(selectedProduct.count  == 0){
            this.removeItem(id)
        }
        else{
            selectedProduct.total = selectedProduct.count * selectedProduct.price
            this.setState({
                cart : [...tempCart]
            } , () =>{
                this.addTotals()
            }) 
        }
        
    }

    removeItem = (id) =>{
        let tempProduct = [...this.state.products]
        let tempCart = [...this.state.cart]
        tempCart = tempCart.filter((item)=> item.id !== id  )
        const index = tempProduct.indexOf(this.getItem(id))
        let removedProduct  = tempProduct[index]
        removedProduct.inCart = false
        removedProduct.count = 0
        removedProduct.total  = 0 
        this.setState({
            cart : [...tempCart],
            product: [...tempProduct]
        }, () =>{
            this.addTotals()
        })
    }
    clearCart = () =>{
        this.setState({
            cart: []
        }, () =>{
            this.setProducts()
        })
    }
    addTotals = () =>{
        let subTotal = 0;
        this.state.cart.map((item)=> {
            subTotal += item.total
        })
        const tempTax = subTotal * 0.12
        const tax  = parseFloat(tempTax.toFixed(2))
        const total  = subTotal + tax
        this.setState({
            cartSubTotal : subTotal,
            cartTax : tax,
            cartTotal: total
        })

    }
    render() {
        return (
            <ProductContext.Provider value= {{
                ...this.state,
                handleDetail:this.handleDetail,
                addToCart: this.addToCart,
                openModal: this.openModal,
                closeModal: this.closeModal,
                increment: this.increment,
                decrement: this.decrement,
                clearCart: this.clearCart,
                removeItem : this.removeItem

            }}> 
                {this.props.children}
            </ProductContext.Provider>
        )
    }
}

const ProductConsumer = ProductContext.Consumer
export {ProductProvider, ProductConsumer }