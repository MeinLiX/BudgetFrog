using Microsoft.AspNetCore.Mvc;
using WepApi.Context.Interfaces;
using WepApi.Utils.Wrapper;

namespace WepApi.Controllers.Api;

public class OldExchangerController : BaseController
{
    private readonly IExchangeRateContext _ER_context;

    public OldExchangerController(IExchangeRateContext ER_context)
    {
        _ER_context = ER_context;
    }

    [HttpGet("all")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Get()
    {
        try
        {
            var exchangeRates = await _ER_context.FFbase
                                            .Include(er => er.results)
                                            .OrderByDescending(er => er.ID)
                                            .FirstOrDefaultAsync();

            return new JsonResult(Result<object>.Success(exchangeRates))
            {
                StatusCode = StatusCodes.Status200OK
            };
        }
        catch (Exception ex)
        {
            return new JsonResult(Result.Fail(ex.Message))
            {
                StatusCode = StatusCodes.Status400BadRequest
            };
        }
    }

    [HttpGet("available")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult AvailableCurrencies()
    {
        try
        {
            const string currencies = "AED|AFN|ALL|AMD|ANG|AOA|ARS|AUD|AWG|AZN|BAM|BBD|BDT|BGN|BHD|BIF|BMD|BND|BOB|BRL|BSD|BTN|BWP|BZD|CAD|CDF|CHF|CLF|CLP|CNH|CNY|COP|CUP|CVE|CZK|DJF|DKK|DOP|DZD|EGP|ERN|ETB|EUR|FJD|FKP|GBP|GEL|GHS|GIP|GMD|GNF|GTQ|GYD|HKD|HNL|HRK|HTG|HUF|IDR|ILS|INR|IQD|IRR|ISK|JMD|JOD|JPY|KES|KGS|KHR|KMF|KPW|KRW|KWD|KYD|KZT|LAK|LBP|LKR|LRD|LSL|LYD|MAD|MDL|MGA|MKD|MMK|MNT|MOP|MRU|MUR|MVR|MWK|MXN|MYR|MZN|NAD|NGN|NOK|NPR|NZD|OMR|PAB|PEN|PGK|PHP|PKR|PLN|PYG|QAR|RON|RSD|RUB|RWF|SAR|SCR|SDG|SEK|SGD|SHP|SLL|SOS|SRD|SYP|SZL|THB|TJS|TMT|TND|TOP|TRY|TTD|TWD|TZS|UAH|UGX|USD|UYU|UZS|VND|VUV|WST|XAF|XCD|XDR|XOF|XPF|YER|ZAR|ZMW";
            return new JsonResult(Result<object>.Success(
                    new
                    {
                        currencies = currencies.Split("|")
                    }))
            {
                StatusCode = StatusCodes.Status200OK
            };
        }
        catch (Exception ex)
        {
            return new JsonResult(Result.Fail(ex.Message))
            {
                StatusCode = StatusCodes.Status400BadRequest
            };
        }
    }

    [HttpGet("one")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Get([FromQuery] string from, [FromQuery] string to)
    {
        try
        {
            if (from is null || to is null)
                throw new Exception("Uncorrect from or(and) to");

            var exchangeRates = await _ER_context.FFbase
                                            .Include(er => er.results)
                                            .OrderByDescending(er => er.ID)
                                            .FirstOrDefaultAsync();

            return new JsonResult(Result<object>.Success(
                    new
                    {
                        from,
                        to,
                        rate = exchangeRates.GetRate(from, to)
                    }))
            {
                StatusCode = StatusCodes.Status200OK
            };
        }
        catch (Exception ex)
        {
            return new JsonResult(Result.Fail(ex.Message))
            {
                StatusCode = StatusCodes.Status400BadRequest
            };
        }
    }

    [HttpGet("convert")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Get([FromQuery] string from, [FromQuery] string to, [FromQuery] decimal amount)
    {
        try
        {
            if (from is null || to is null)
                throw new Exception("Uncorrect from or(and) to");
            if (amount < 0)
                throw new Exception("Uncorrect amount");

            var exchangeRates = await _ER_context.FFbase
                                            .Include(er => er.results)
                                            .OrderByDescending(er => er.ID)
                                            .FirstOrDefaultAsync();

            return new JsonResult(Result<object>.Success(
                    new
                    {
                        from,
                        fromAmount = amount,
                        to,
                        toAmount = exchangeRates.Convert(from, to, amount),
                        rate = exchangeRates.GetRate(from, to)
                    }))
            {
                StatusCode = StatusCodes.Status200OK
            };
        }
        catch (Exception ex)
        {
            return new JsonResult(Result.Fail(ex.Message))
            {
                StatusCode = StatusCodes.Status400BadRequest
            };
        }
    }
}
