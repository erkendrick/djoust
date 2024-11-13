using UnityEngine;

public class PlayerController : MonoBehaviour
{
    private Rigidbody2D rb;
    public float moveForce = 2f;
    public float jumpForce = 5f;
    public float dashForce = 5f;
    public float maxSpeed = 7f;
    public float spinSpeed = 1f;
    public float maxSpinSpeed = 500f;

    private void Start()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    private void Update()
    {
        PlayerMovement();
        ClampVelocity();
        ClampRotationalVelocity();
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

        // Spin Controls
        if (Input.GetKey(KeyCode.Q))
        {
            rb.AddTorque(spinSpeed);
        }

        if (Input.GetKey(KeyCode.E))
        {
            rb.AddTorque(-spinSpeed);

        }
    }

    private void ClampVelocity()
    {
        if (rb.velocity.magnitude > maxSpeed)
        {
            rb.velocity = rb.velocity.normalized * maxSpeed;
        }
    }

    private void ClampRotationalVelocity()
    {
        if (Mathf.Abs(rb.angularVelocity) > maxSpinSpeed)
        {
            rb.angularVelocity = Mathf.Sign(rb.angularVelocity) * maxSpinSpeed;
        }
    }
}