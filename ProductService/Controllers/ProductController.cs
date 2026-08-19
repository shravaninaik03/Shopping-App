using Microsoft.AspNetCore.Mvc;
using ProductService.Interface;
using ProductService.Service;
using ProductService.Models;
namespace ProductService.Controllers;


[ApiController]
[Route("api/[controller]")]

public class ProductController: ControllerBase
{
    private readonly IProductService _productservice;

    public ProductController(IProductService proservice)
    {
        _productservice=proservice;
    }

    [HttpGet]
    public IActionResult GetProducts()
    {
        var products = _productservice.GetProducts();
        return Ok(products);
    }
    [HttpGet("{id}")]
    public IActionResult GetProductById(int id)
    {
        var product = _productservice.GetProductById(id);

        if (product == null)
            return NotFound();

        return Ok(product);
    }
}