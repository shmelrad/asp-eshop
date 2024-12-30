public class Category
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public ICollection<Product> Products { get; set; } = new List<Product>();
}

public class CategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; }
} 