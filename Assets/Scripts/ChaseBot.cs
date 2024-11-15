using UnityEngine;

public class ChaseBot : MonoBehaviour
{
    public float rotationSpeed = 120f;
    public float moveForce = 3f;
    public float maxSpeed = 6f;
    public float jumpForce = 5f;

    private Transform playerTransform;
    private Rigidbody2D rb;

    void Start()
    {
        playerTransform = GameObject.FindGameObjectWithTag("Player").transform;
        rb = GetComponent<Rigidbody2D>();
    }

    void FixedUpdate()
    {
        RotateTowardsPlayer();
        MoveTowardsPlayer();
        JumpTowardsPlayer();
        ClampVelocity();
    }

    private void RotateTowardsPlayer()
    {
        Vector2 direction = (playerTransform.position - transform.position).normalized;
        float targetAngle = Mathf.Atan2(direction.y, direction.x) * Mathf.Rad2Deg;
        float currentAngle = transform.eulerAngles.z;
        float newAngle = Mathf.MoveTowardsAngle(currentAngle, targetAngle, rotationSpeed * Time.fixedDeltaTime);
        transform.rotation = Quaternion.Euler(0, 0, newAngle);
    }

    private void MoveTowardsPlayer()
    {
        Vector2 direction = playerTransform.position - transform.position;

        if (direction.x < -0.1f)
        {
            rb.AddForce(Vector2.left * moveForce);
        }
        else if (direction.x > 0.1f)
        {
            rb.AddForce(Vector2.right * moveForce);
        }
    }

    private void JumpTowardsPlayer()
    {
        Vector2 direction = playerTransform.position - transform.position;

        if (direction.y > 0.1f)
        {
            rb.AddForce(Vector2.up * jumpForce, ForceMode2D.Impulse);
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
