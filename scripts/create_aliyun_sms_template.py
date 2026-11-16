"""Submit the student-invitation SMS template to Alibaba Cloud SMS.

Install dependencies with:
    python -m pip install -r requirements-aliyun-sms.txt
"""

import os
from pathlib import Path

from alibabacloud_dysmsapi20170525.client import Client
from alibabacloud_dysmsapi20170525 import models as sms_models
from alibabacloud_tea_openapi import models as open_api_models
from alibabacloud_tea_util import models as util_models
from dotenv import load_dotenv


ROOT = Path(__file__).resolve().parent.parent
TEMPLATE_NAME = "课程学习邀请"
SIGNATURE_NAME = "林扬东方北京"
TEMPLATE_CONTENT = "尊敬的学员您好，欢迎使用验证码自助登录林扬东方官网。"
TEMPLATE_REMARK = "用于邀请学员登录林扬东方官网并使用验证码自助登录，不包含网址。"


def main() -> None:
    load_dotenv(ROOT / ".env.local", override=True)

    access_key_id = os.getenv("ALIYUN_ACCESS_KEY_ID")
    access_key_secret = os.getenv("ALIYUN_ACCESS_KEY_SECRET")
    missing = [
        name
        for name, value in (
            ("ALIYUN_ACCESS_KEY_ID", access_key_id),
            ("ALIYUN_ACCESS_KEY_SECRET", access_key_secret),
        )
        if not value
    ]
    if missing:
        raise RuntimeError(
            f"Missing required values in .env.local: {', '.join(missing)}"
        )

    config = open_api_models.Config(
        access_key_id=access_key_id,
        access_key_secret=access_key_secret,
    )
    config.endpoint = "dysmsapi.aliyuncs.com"
    client = Client(config)

    request = sms_models.CreateSmsTemplateRequest(
        template_type=1,
        template_name=TEMPLATE_NAME,
        template_content=TEMPLATE_CONTENT,
        remark=TEMPLATE_REMARK,
        related_sign_name=SIGNATURE_NAME,
    )
    response = client.create_sms_template_with_options(
        request, util_models.RuntimeOptions()
    )
    body = response.body

    if body.code != "OK":
        raise RuntimeError(
            f"Alibaba Cloud rejected the request: {body.code} - {body.message}"
        )
    if not body.template_code:
        raise RuntimeError(
            f"Request succeeded without a template code. RequestId: {body.request_id}"
        )

    print(f"TemplateCode: {body.template_code}")
    print("模板已提交审核；审核通过后才可用于发送短信。")


if __name__ == "__main__":
    main()
