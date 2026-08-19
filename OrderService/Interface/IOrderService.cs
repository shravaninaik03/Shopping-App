namespace OrderService.Interface;
using OrderService.Models;
public interface IOrderService
{
    public List<Order> GetOrders();

    public Task<Order> AddOrder(Order order);

    public Order? UpdateOrder(int id, Order order); 

    public bool DeleteOrder(int id);
}