"""
Deal list filters using django-filter.
"""
import django_filters
from .models import Deal


class DealFilter(django_filters.FilterSet):
    """Filter deals by status and extracted_json fields (PostgreSQL JSONField)."""

    status = django_filters.ChoiceFilter(choices=Deal.STATUS_CHOICES)
    sector = django_filters.CharFilter(
        field_name="extracted_json__entities__sector",
        lookup_expr="icontains",
    )
    company = django_filters.CharFilter(
        field_name="extracted_json__entities__company",
        lookup_expr="icontains",
    )
    stage = django_filters.CharFilter(
        field_name="extracted_json__tags__stage",
        lookup_expr="iexact",
    )
    category = django_filters.CharFilter(method="filter_category")

    class Meta:
        model = Deal
        fields = ["status"]

    @staticmethod
    def filter_category(queryset, name, value):
        if not value:
            return queryset
        return queryset.filter(
            extracted_json__tags__category__contains=[value.strip()]
        )
