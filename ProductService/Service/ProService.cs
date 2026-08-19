using ProductService.Models;
using ProductService.Data;
using ProductService.Interface;
namespace ProductService.Service;

public class ProService:IProductService
{
    private readonly AppDbContext _context;

    public ProService(AppDbContext context)
    {
        _context=context;
    }

    public List<Product> GetProducts()
    {
        return _context.Products.ToList();
    }
    public Product? GetProductById(int id)
    {
    return _context.Products.Find(id);
    }
}
