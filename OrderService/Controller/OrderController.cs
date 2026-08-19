using OrderService.Interface;
using OrderService.Service;
using Microsoft.AspNetCore.Mvc;
using OrderService.Models;
namespace OrderService.Controller;

[ApiController]
[Route("api/[controller]")]
public class OrderController: ControllerBase
{
    private readonly IOrderService _orderservice;
    public OrderController(IOrderService orderservice)
    {
        _orderservice=orderservice;
    }

    [HttpGet]
    public IActionResult GetOrders()
    {
        var or=  _orderservice.GetOrders();
        return Ok(or);
    }
    [HttpPost]
    public async Task<IActionResult> AddOrder(Order order)
    {
       var result= await _orderservice.AddOrder(order);
       return Ok(result);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateOrder(int id,Order order)
    {
        var result = _orderservice.UpdateOrder(id,order);
        if(result==null)
        {
            return NotFound();
        }
        return Ok(result);
    }
     [HttpDelete("{id}")]
    public IActionResult DeleteOrder(int id)
    {
        var result = _orderservice.DeleteOrder(id);

        if (!result)
            return NotFound();

        return Ok("Order cancelled successfully.");
    }

}