using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace JobPortalWebAPI.CustomActionFilter
{
    // Creating a custom validation filter lets you centralize your model validation error handling and send back your custom error format automatically — no need to repeat validation code in every action.
    public class ValidateModelAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            if (!context.ModelState.IsValid)
            {
                var errors = context.ModelState
                    .Where(ms => ms.Value.Errors.Count > 0)
                    .ToDictionary(
                        kvp => kvp.Key,
                        kvp => kvp.Value.Errors.First().ErrorMessage
                    );

                context.Result = new BadRequestObjectResult(new
                {
                    message = "Validation failed!!",
                    errors
                });
            }
        }
    }
}
