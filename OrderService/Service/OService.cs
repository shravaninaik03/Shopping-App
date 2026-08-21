using OrderService.Interface;
using OrderService.Data;
using System.Net.Http.Json;
using OrderService.Models;
namespace OrderService.Service;

public class OService : IOrderService
{
    private readonly AppDbContext _context;
    private readonly HttpClient _httpClient;

   public OService(AppDbContext context, HttpClient httpClient)
    {
        _context = context;
        _httpClient = httpClient;
    }

    public List<Order> GetOrders()
    {
        return _context.Orders.ToList();
    }

    public async Task<Order> AddOrder(Order order)
    {

        var response = await _httpClient.GetAsync(          // Ask ProductService for the product
    "http://localhost:5261/api/product/" + order.ProductId);

        response.EnsureSuccessStatusCode(); //Checks if success
        var product = await response.Content.ReadFromJsonAsync<ProductDto>(); //Takes the JSON response and converts it into our ProductDto object.

        if (product == null)
        {
            throw new Exception("Product not found");
        }
        order.ProductName = product.Name; //store product name
        order.TotalPrice = product.Price * order.Quantity;  //calculate price
        _context.Orders.Add(order);
        _context.SaveChanges();


        return order;
    }
     public Order? UpdateOrder(int id, Order order)
    {
        var existingOrder = _context.Orders.Find(id);

        if (existingOrder == null)
            return null;

        existingOrder.ProductId = order.ProductId;
        existingOrder.Quantity = order.Quantity;
        existingOrder.TotalPrice = order.TotalPrice;
        existingOrder.Status = order.Status;

        _context.SaveChanges();
        return existingOrder;
    }

    public bool DeleteOrder(int id)
    {
        var order = _context.Orders.Find(id);

        if (order == null)
            return false;

        _context.Orders.Remove(order);
        _context.SaveChanges();

        return true;
    }

}