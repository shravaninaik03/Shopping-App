using ProductService.Models;

namespace ProductService.Interface;

public interface IProductService
{
    List<Product> GetProducts();
    Product? GetProductById(int id);
}