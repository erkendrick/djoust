using UnityEngine;

public class WeaponBehavior : MonoBehaviour
{
    private Rigidbody2D playerRigidbody;
    private bool isStuck = false;
    private BoxCollider2D triggerCollider;
    private BoxCollider2D collisionCollider;

    private void Awake()
    {
        BoxCollider2D[] colliders = GetComponents<BoxCollider2D>();
        if (colliders[0].isTrigger)
        {
            triggerCollider = colliders[0];
            collisionCollider = colliders[1];
        }
        else
        {
            triggerCollider = colliders[1];
            collisionCollider = colliders[0];
        }

        playerRigidbody = GetComponentInParent<Rigidbody2D>();

    }

    private void Update()
    {
        if (isStuck && (Input.GetKeyDown(KeyCode.A) || Input.GetKeyDown(KeyCode.D) || Input.GetKeyDown(KeyCode.Space)))
        {
            UnfreezePlayer();
        }
    }
    void OnTriggerEnter2D(Collider2D collision)
    {
        if (collision.CompareTag("Platform"))
        {
            FreezePlayer();
        }

        if (collision.CompareTag("ChaseBot") || collision.CompareTag("CircleBot"))
        {
            Destroy(collision.gameObject);
            FindObjectOfType<GameManager>().IncrementKillCounter();
        }
    }

    void OnTriggerExit2D(Collider2D collision)
    {
        if (collision.CompareTag("Platform") && isStuck)
        {
            UnfreezePlayer();
        }
    }

    private void FreezePlayer()
    {
        isStuck = true;
        playerRigidbody.freezeRotation = true;
        playerRigidbody.velocity = Vector2.zero;
        playerRigidbody.isKinematic = true;
    }

    private void UnfreezePlayer()
    {
        isStuck = false;
        playerRigidbody.freezeRotation = false;
        playerRigidbody.isKinematic = false;
    }
}