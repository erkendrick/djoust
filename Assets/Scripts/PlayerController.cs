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

    // Input variables
    private float horizontalInput = 0f;
    private bool jumpInput = false;
    private bool dashInput = false;
    private float spinInput = 0f;

    private void Start()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    private void Update()
    {
        // Handle input
        if (Input.GetKey(KeyCode.A))
        {
            horizontalInput = -1f;
        }
        else if (Input.GetKey(KeyCode.D))
        {
            horizontalInput = 1f;
        }
        else
        {
            horizontalInput = 0f;
        }

        if (Input.GetKeyDown(KeyCode.Space))
        {
            jumpInput = true;
        }

        if (Input.GetKeyDown(KeyCode.LeftShift))
        {
            dashInput = true;
        }

        // Spin Controls
        if (Input.GetKey(KeyCode.Q))
        {
            spinInput = 1f;
        }
        else if (Input.GetKey(KeyCode.E))
        {
            spinInput = -1f;
        }
        else
        {
            spinInput = 0f;
        }
    }

    private void FixedUpdate()
    {
        PlayerMovement();
        ClampVelocity();
        ClampRotationalVelocity();
    }

    private void PlayerMovement()
    {
        // Horizontal Movement
        rb.AddForce(Vector2.right * horizontalInput * moveForce);

        // Jump
        if (jumpInput)
        {
            rb.AddForce(Vector2.up * jumpForce, ForceMode2D.Impulse);
            jumpInput = false;
        }

        // Dash
        if (dashInput)
        {
            Vector2 dashDirection = transform.right;
            rb.AddForce(dashDirection * dashForce, ForceMode2D.Impulse);
            dashInput = false;
        }

        // Spin Controls
        rb.AddTorque(spinInput * spinSpeed);
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
