using UnityEngine;

public class PlayerController : MonoBehaviour
{
    private Rigidbody2D rb;
    public float moveForce = 5f;
    public float jumpForce = 5f;
    public float dashForce = 5f;
    public float maxSpeed = 10f;

    private void Start()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    private void Update()
    {
        PlayerMovement();
        ClampVelocity();
    }

    private void PlayerMovement()
    {
        if (Input.GetKey(KeyCode.A))
        {
            rb.AddForce(Vector2.left * moveForce);
        }
        if (Input.GetKey(KeyCode.D))
        {
            rb.AddForce(Vector2.right * moveForce);
        }
        if (Input.GetKeyDown(KeyCode.Space))
        {
            rb.AddForce(Vector2.up * jumpForce, ForceMode2D.Impulse);
        }
        if (Input.GetKeyDown(KeyCode.LeftShift))
        {
            Vector2 dashDirection = transform.right;
            rb.AddForce(dashDirection * dashForce, ForceMode2D.Impulse);
        }
    }

    private void ClampVelocity()
    {
        if (rb.velocity.magnitude > maxSpeed)
        {
            rb.velocity = rb.velocity.normalized * maxSpeed;
        }
    }
}
